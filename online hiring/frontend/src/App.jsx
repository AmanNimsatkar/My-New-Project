import React, { useEffect, useState } from 'react'
function handleChange(e) {
const { name, value } = e.target;
setForm(prev => ({ ...prev, [name]: value }));
}


function handleFile(e) {
setForm(prev => ({ ...prev, image: e.target.files[0] }));
}


async function handleSubmit(e) {
e.preventDefault();
setLoading(true);
try {
const fd = new FormData();
fd.append('name', form.name);
fd.append('email', form.email);
fd.append('skills', form.skills);
fd.append('bio', form.bio);
if (form.image) fd.append('image', form.image);


const res = await fetch(`${API_BASE}/api/workers`, { method: 'POST', body: fd });
if (!res.ok) throw new Error('Upload failed');
setForm({ name: '', email: '', skills: '', bio: '', image: null });
await fetchWorkers();
} catch (err) {
console.error(err);
alert('Upload failed');
} finally { setLoading(false); }
}


return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-4xl mx-auto">
<header className="flex items-center justify-between mb-6">
<h1 className="text-3xl font-bold">Hire Workers — Quick Portal</h1>
<p className="text-sm text-gray-600">Add worker profiles with image</p>
</header>


<section className="bg-white p-6 rounded-2xl shadow mb-6">
<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
<input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className="p-3 border rounded" />
<input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="p-3 border rounded" />
<input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="p-3 border rounded col-span-2" />
<textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio" className="p-3 border rounded col-span-2" />


<div className="col-span-2 flex items-center gap-4">
<input type="file" accept="image/*" onChange={handleFile} />
<button type="submit" disabled={loading} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">
{loading ? 'Uploading...' : 'Add Worker'}
</button>
</div>
</form>
</section>


<section>
<h2 className="text-xl font-semibold mb-4">Worker Gallery</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{workers.map(w => (
<div key={w._id} className="bg-white rounded-lg p-4 shadow">
<div className="h-40 w-full bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
{w.imagePath ? (
<img src={`${API_BASE}${w.imagePath}`} alt={w.name} className="object-cover h-full w-full" />
) : (
<div className="text-gray-400">No image</div>
)}
</div>
<h3 className="font-semibold">{w.name}</h3>
<p className="text-sm text-gray-600">{w.email}</p>
<p className="mt-2 text-sm">{w.bio}</p>
<div className="mt-2 text-xs text-gray-500">Skills: {w.skills.join(', ')}</div>
</div>
))}
</div>
</section>
</div>
</div>
);
